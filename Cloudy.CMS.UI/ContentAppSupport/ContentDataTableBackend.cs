﻿using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using Cloudy.CMS.ContentSupport.Serialization;
using Cloudy.CMS.DocumentSupport;
using Poetry.UI.DataTableSupport.BackendSupport;
using Cloudy.CMS.ContentSupport;
using Cloudy.CMS.ContentSupport.RepositorySupport;
using Cloudy.CMS.ContentTypeSupport;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Cloudy.CMS.UI.ContentAppSupport
{
    public class ContentDataTableBackend<T> : IBackend where T : class
    {
        int PageSize { get; } = 20;

        IContainerProvider ContainerProvider { get; }
        IContentTypeProvider ContentTypeRepository { get; }
        IContentDeserializer ContentDeserializer { get; }

        public ContentDataTableBackend(IContainerProvider containerProvider, IContentTypeProvider contentTypeRepository, IContentDeserializer contentDeserializer)
        {
            ContainerProvider = containerProvider;
            ContentTypeRepository = contentTypeRepository;
            ContentDeserializer = contentDeserializer;
        }

        public Result Load(Query query)
        {
            var contentType = ContentTypeRepository.Get(typeof(T));

            var documents = ContainerProvider.Get(contentType.Container).FindSync(Builders<Document>.Filter.Eq(d => d.GlobalFacet.Interfaces["IContent"].Properties["ContentTypeId"], contentType.Id)).ToList();

            var items = new List<T>();

            foreach(var document in documents)
            {
                items.Add((T)ContentDeserializer.Deserialize(document, contentType, DocumentLanguageConstants.Global));
            }

            var sortByPropertyName = query.SortBy ?? (typeof(INameable).IsAssignableFrom(typeof(T)) ? "Name" : "Id");
            var sortByProperty = contentType.PropertyDefinitions.FirstOrDefault(p => p.Name == sortByPropertyName);

            if (sortByProperty != null)
            {
                var sortBy = (Func<T, object>)(i => sortByProperty.Getter(i));

                if (query.SortDirection == Poetry.UI.DataTableSupport.BackendSupport.SortDirection.Descending)
                {
                    items = items.OrderByDescending(sortBy).ToList();
                }
                else
                {
                    items = items.OrderBy(sortBy).ToList();
                }
            }

            return new Result(
                PageSize,
                items.Skip(PageSize * (query.Page - 1)).Take(PageSize),
                items.Count
            );
        }
    }
}